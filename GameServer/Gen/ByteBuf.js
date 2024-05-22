const MIN_CAPACITY = 16

const f_2power32 = Math.pow(2, 32)
const f_2power56 = Math.pow(2, 56)

class ByteBuf {
    static emptyBuff = Buffer.allocUnsafe(0)

    constructor(bytes) {
        this._bytes = bytes != null ? Buffer.from(bytes) : emptyBuff
        this._readerIndex = 0
        this._writerIndex = bytes != null ? bytes.length : 0
    }


    Replace (bytes) {
        this._bytes = Buffer.from(bytes)
        this._readerIndex = 0
        this._writerIndex = bytes.length
    }

    Replace2 (bytes, beginPos, endPos) {
        this._bytes = Buffer.from(bytes, beginPos, endPos - beginPos)
        this._readerIndex = beginPos
        this._writerIndex = endPos
    }

    get Capacity () { return this._bytes.length }
    get Size () { return this._writerIndex - this._readerIndex }
    get Empty () { return this._writerIndex <= this._readerIndex }
    get NotEmpty () { return this._writerIndex > this._readerIndex }

    getBytesNotSafe () { return this._bytes }


    AddWriteIndex (add) {
        this._writerIndex += add
    }

    AddReadIndex (add) {
        this._readerIndex += add
    }

    static emptyBytes = new Uint8Array()

    CopyData () {
        const n = this.Remaining
        if (n > 0) {
            return new Uint8Array(this._bytes.buffer.slice(this._readerIndex, this._writerIndex))
        } else {
            return ByteBuf.emptyBytes
        }
    }

    get Remaining () { return this._writerIndex - this._readerIndex }

    DiscardReadBytes () {
        this._bytes.copyWithin(0, this._readerIndex, this._writerIndex)
        this._writerIndex -= this._readerIndex
        this._readerIndex = 0
    }

    get NotCompactWritable () { return this._bytes.length - this._writerIndex }

    WriteBytesWithoutSize (bs) {
        this.WriteBytesWithoutSize2(bs, 0, bs.length)
    }

    WriteBytesWithoutSize2 (bs, offset, len) {
        this.EnsureWrite(len)
        for (let i = 0; i < len; i++) {
            this._bytes[this._writerIndex + i] = bs[offset + i]
        }
        this._writerIndex += len
    }

    Clear () {
        this._readerIndex = this._writerIndex = 0
    }


    static PropSize (initSize, needSize) {
        for (let i = Math.max(initSize, MIN_CAPACITY); i <<= 1;) {
            if (i >= needSize) {
                return i
            }
        }
    }

    EnsureWrite0 (size) {
        const needSize = this._writerIndex + size - this._readerIndex
        // console.log(`== EnsureWrite0. size:${size} need:${needSize}`)
        if (needSize <= this.Capacity) {
            this._bytes.copyWithin(0, this._readerIndex, this._writerIndex)
            this._writerIndex -= this._readerIndex
            this._readerIndex = 0
        } else {
            const newCapacity = ByteBuf.PropSize(this.Capacity, needSize)
            // console.log(`== EnsureWrite AllocUnsafe.  need:${needSize} new capacity:${newCapacity}`)
            const oldBuf = this._bytes
            this._bytes = Buffer.allocUnsafe(newCapacity)
            oldBuf.copy(this._bytes, 0, this._readerIndex, this._writerIndex)
            this._writerIndex -= this._readerIndex
            this._readerIndex = 0
        }
    }

    EnsureWrite (size) {
        if (this._writerIndex + size > this.Capacity) {
            this.EnsureWrite0(size)
        }
    }


    EnsureRead (size) {
        if (this._readerIndex + size > this._writerIndex) {
            throw new Error()
        }
    }


    CanRead (size) {
        return (this._readerIndex + size <= this._writerIndex)
    }

    WriteBool (b) {
        this.EnsureWrite(1)
        this._bytes.writeUInt8(b ? 1 : 0, this._writerIndex++)
    }

    ReadBool () {
        this.EnsureRead(1)
        return this._bytes[this._readerIndex++] != 0
    }

    WriteByte (x) {
        this.EnsureWrite(1)
        this._bytes[this._writerIndex++] = x
    }

    ReadByte () {
        this.EnsureRead(1)
        return this._bytes[this._readerIndex++]
    }

    WriteShort (x) {
        if (x >= 0) {
            if (x < 0x80) {
                this.EnsureWrite(1)
                this._bytes.writeUInt8(x, this._writerIndex++)
                return
            }
            else if (x < 0x4000) {
                this.EnsureWrite(2)
                const v = x | 0x8000
                this._bytes.writeUInt16BE(v, this._writerIndex)
                this._writerIndex += 2
                return
            }
        }
        this.EnsureWrite(4)
        this._bytes.writeUInt8(0xff, this._writerIndex)
        this._bytes.writeInt16BE(x, this._writerIndex + 1)
        this._writerIndex += 3
    }

    ReadShort () {
        this.EnsureRead(1)
        const buf = this._bytes
        const h = buf.readUInt8(this._readerIndex)
        if (h < 0x80) {
            this._readerIndex++
            return h
        }
        else if (h < 0xc0) {
            this.EnsureRead(2)
            const x = buf.readUInt16BE(this._readerIndex) & 0x3fff
            this._readerIndex += 2
            return x
        }
        else if ((h == 0xff)) {
            this.EnsureRead(3)
            const x = buf.readInt16BE(this._readerIndex + 1)
            this._readerIndex += 3
            return x
        }
        else {
            throw new Error()
        }
    }

    ReadFshort () {
        this.EnsureRead(2)
        const x = this._bytes.readInt16LE(this._readerIndex)
        this._readerIndex += 2
        return x
    }

    WriteFshort (x) {
        this.EnsureWrite(2)
        this._bytes.writeInt16LE(x, this._writerIndex)
        this._writerIndex += 2
    }


    WriteInt (x) {
        if (x < 0) {
            this.EnsureWrite(5)
            this._bytes.writeUInt8(0xff, this._writerIndex)
            // if (x >= Number.MIN_SAFE_INTEGER) {
            //     this._bytes.writeInt32BE(x / f_2power32, this._writerIndex + 1)
            //     this._bytes.writeUInt32BE(x % f_2power32, this._writerIndex + 5)
            // } else {
            this._bytes.writeInt32BE(x, this._writerIndex + 1)
            // }
            this._writerIndex += 5
        } else if (x < 0x80) {
            this.EnsureWrite(1)
            this._bytes.writeUInt8(x, this._writerIndex++)
        }
        else if (x < 0x4000) // 10 11 1111, -
        {
            this.EnsureWrite(2)
            this._bytes.writeUInt16BE(x | 0x8000, this._writerIndex)
            this._writerIndex += 2
        }
        else if (x < 0x200000) // 110 1 1111, -,-
        {
            // It's not 3 here. It's intentional. 4 bytes are written in big endian mode.
            this.EnsureWrite(4)
            this._bytes.writeInt32BE((x | 0xc00000) << 8, this._writerIndex)
            this._writerIndex += 3
        }
        else if (x < 0x10000000) // 1110 xxxx,-,-,-
        {
            this.EnsureWrite(4)
            this._bytes.writeInt32BE(x | 0xe0000000, this._writerIndex)
            this._writerIndex += 4
        }
        else {
            //For optimization, we use 8 instead of 5 because we will write a long at once
            this.EnsureWrite(5)
            this._bytes.writeUInt8(0xf0, this._writerIndex)
            this._bytes.writeUInt32BE(x, this._writerIndex + 1)
            this._writerIndex += 5
        }
    }


    ReadInt () {
        const buf = this._bytes
        this.EnsureRead(1)
        const h = buf.readUInt8(this._readerIndex)
        if (h < 0x80) {
            this._readerIndex++
            return h
        }
        else if (h < 0xc0) {
            this.EnsureRead(2)
            const x = buf.readUInt16BE(this._readerIndex) & 0x3fff
            this._readerIndex += 2
            return x
        }
        else if (h < 0xe0) {
            // console.log(`== read ${buf.readInt32BE(this._readerIndex)}`)
            this.EnsureRead(3)
            const x = ((h & 0x1f) << 16) | (buf.readUInt16BE(this._readerIndex + 1))
            this._readerIndex += 3
            return x
        }
        else if (h < 0xf0) {
            this.EnsureRead(4)
            // console.log(`== read ${buf.readInt32BE(this._readerIndex)}`)
            const x = buf.readInt32BE(this._readerIndex) & 0x0fffffff
            this._readerIndex += 4
            return x
        }
        else {
            this.EnsureRead(5)
            const x = buf.readInt32BE(this._readerIndex + 1)
            this._readerIndex += 5
            return x
        }
    }

    ReadFint () {
        this.EnsureRead(4)
        const x = this._bytes.readInt32LE()
        this._readerIndex += 4
        return x
    }


    WriteFint (x) {
        this.EnsureWrite(4)
        this._bytes.writeInt32LE(x, this._writerIndex)
        this._writerIndex += 4
    }

    WriteNumberAsLong (x) {
        if (x < 0) {
            this.EnsureWrite(9)
            this._bytes.writeUInt8(0xff, this._writerIndex)
            // if (x >= Number.MIN_SAFE_INTEGER) {
            //     this._bytes.writeInt32BE(x / f_2power32, this._writerIndex + 1)
            //     this._bytes.writeUInt32BE(x % f_2power32, this._writerIndex + 5)
            // } else {
            this._bytes.writeBigInt64BE(BigInt(x), this._writerIndex + 1)
            // }
            this._writerIndex += 9
        } else if (x < 0x80) {
            this.EnsureWrite(1)
            this._bytes.writeUInt8(x, this._writerIndex++)
        }
        else if (x < 0x4000) // 10 11 1111, -
        {
            this.EnsureWrite(2)
            this._bytes.writeUInt16BE(x | 0x8000, this._writerIndex)
            this._writerIndex += 2
        }
        else if (x < 0x200000) // 110 1 1111, -,-
        {
            // It's not 3 here. It's intentional. 4 bytes are written in big endian mode.
            this.EnsureWrite(4)
            this._bytes.writeInt32BE((x | 0xc00000) << 8, this._writerIndex)
            this._writerIndex += 3
        }
        else if (x < 0x10000000) // 1110 xxxx,-,-,-
        {
            this.EnsureWrite(4)
            this._bytes.writeInt32BE(x | 0xe0000000, this._writerIndex)
            this._writerIndex += 4
        }
        else if (x < 0x800000000) // 1111 0xxx,-,-,-,-
        {
            // For optimization, we use 8 instead of 5 because we will write a long at once
            this.EnsureWrite(8)
            this._bytes.writeUInt8((x / 0x100000000) | 0xf0, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 1)
            this._writerIndex += 5
        }
        else if (x < 0x40000000000) // 1111 10xx, -,-,-,-,-
        {
            this.EnsureWrite(8)
            this._bytes.writeUInt16BE((x / 0x100000000) | 0xf800, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 2)
            this._writerIndex += 6
        }
        else if (x < 0x200000000000) // 1111 110x, -,-,-,-,-,-
        {
            this.EnsureWrite(8)
            this._bytes.writeInt32BE(((x / 0x100000000) | 0xfc0000) << 8, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 3)
            this._writerIndex += 7
        }
        // else /*if (x < 0x100000000000000)*/ // 1111 1110, - - - - - - -
        // {
        //     this.EnsureWrite(8)
        //     this._bytes.writeInt32BE((x / 0x100000000) | 0xfe000000, this._writerIndex)
        //     this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 4)
        //     this._writerIndex += 8
        // }
        else if (x <= Number.MAX_SAFE_INTEGER) // 1111 1110
        {
            this.EnsureWrite(8)
            this._bytes.writeInt32BE((x / 0x100000000) | 0xfe000000, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 4)
            this._writerIndex += 8
        }
        else if (x < f_2power56) // 1111 1110
        {
            // Actually only occupies 8 bits
            this.EnsureWrite(9)
            // this._bytes.writeUInt8(0xfe, this._writerIndex)
            // this._bytes.writeBigUInt64BE(BigInt(x) << BigInt(8), this._writerIndex)

            let n = BigInt(x)
            this._bytes.writeBigUInt64BE(n | (BigInt(0xfe) << BigInt(56)), this._writerIndex)
            // this._bytes.writeInt32BE(Number(n >> BigInt(32)) | 0xfe000000, this._writerIndex)
            // this._bytes.writeUInt32BE(Number(n & BigInt(0xffffffff)), this._writerIndex + 4)
            // this._bytes.writeUInt32BE((x >> 32) | 0xfe000000, this._writerIndex)
            // this._bytes.writeUInt32BE(x & 0xffffffff, this._writerIndex + 4)
            this._writerIndex += 8
        }
        else // 1111 1111
        {
            this.EnsureWrite(9)
            this._bytes.writeUInt8(0xff, this._writerIndex)
            this._bytes.writeBigInt64BE(BigInt(x), this._writerIndex + 1)
            // this._bytes.writeUInt32BE(x >> 32, this._writerIndex + 1)
            // this._bytes.writeUInt32BE(x & 0xffffffff, this._writerIndex + 5)
            this._writerIndex += 9
        }
    }

    ReadLongAsNumber () {
        const buf = this._bytes
        ///
        /// warn! If you make any changes, remember to adjust TryDeserializeInplaceOctets
        this.EnsureRead(1)
        const h = buf.readUInt8(this._readerIndex)
        if (h < 0x80) {
            this._readerIndex++
            return h
        }
        else if (h < 0xc0) {
            this.EnsureRead(2)
            const x = buf.readUInt16BE(this._readerIndex) & 0x3fff
            // console.log(`== read long :${x} index:${this._readerIndex}`)
            this._readerIndex += 2
            return x
        }
        else if (h < 0xe0) {
            // console.log(`== read ${buf.readInt32BE(this._readerIndex)}`)
            this.EnsureRead(3)
            const x = ((h & 0x1f) << 16) | (buf.readUInt16BE(this._readerIndex + 1))
            this._readerIndex += 3
            return x
        }
        else if (h < 0xf0) {
            this.EnsureRead(4)
            // console.log(`== read ${buf.readInt32BE(this._readerIndex)}`)
            const x = buf.readInt32BE(this._readerIndex) & 0x0fffffff
            this._readerIndex += 4
            return x
        }
        else if (h < 0xf8) {
            this.EnsureRead(5)
            const xl = buf.readUInt32BE(this._readerIndex + 1)
            const xh = h & 0x07
            this._readerIndex += 5
            return xh * 0x100000000 + xl
        }
        else if (h < 0xfc) {  // 1111 10xx  - - - - -
            this.EnsureRead(6)
            const xl = buf.readUInt32BE(this._readerIndex + 2)
            const xh = buf.readUInt16BE(this._readerIndex) & 0x3ff
            this._readerIndex += 6
            return xh * 0x100000000 + xl
        }
        else if (h < 0xfe) {
            this.EnsureRead(7)
            const xl = buf.readUInt32BE(this._readerIndex + 3)
            const xh = (buf.readUInt32BE(this._readerIndex) >> 8) & 0x1ffff
            this._readerIndex += 7
            return xh * 0x100000000 + xl
        }
        else if (h < 0xff) { // 1111 1110, - - - - - - -
            this.EnsureRead(8)
            // TODO Do you want to optimize < Number.MAX_SAFE_INTEGER?
            const xl = buf.readUInt32BE(this._readerIndex + 4)
            const xh = buf.readUInt32BE(this._readerIndex) & 0xffffff
            this._readerIndex += 8
            return xh * f_2power32 + xl
        }
        else {
            this.EnsureRead(9)
            const x = buf.readBigInt64BE(this._readerIndex + 1)
            // const xl = buf.readUInt32BE(this._readerIndex + 5)
            // const xh = buf.readInt32BE(this._readerIndex + 1)
            this._readerIndex += 9
            return Number(x)
        }
    }

    WriteLong (n) {
        if (n < 0 || n >= f_2power56) {
            this.EnsureWrite(9)
            this._bytes.writeUInt8(0xff, this._writerIndex)
            this._bytes.writeBigInt64BE(n, this._writerIndex + 1)
            // this._bytes.writeUInt32BE(x >> 32, this._writerIndex + 1)
            // this._bytes.writeUInt32BE(x & 0xffffffff, this._writerIndex + 5)
            this._writerIndex += 9
            return
        }
        if (n > Number.MAX_SAFE_INTEGER) {
            this.EnsureWrite(8)
            this._bytes.writeBigUInt64BE(n | (BigInt(0xfe) << BigInt(56)), this._writerIndex)
            this._writerIndex += 8
            return
        }

        let x = Number(n)
        if (x < 0x80) {
            this.EnsureWrite(1)
            this._bytes.writeUInt8(x, this._writerIndex++)
        }
        else if (x < 0x4000) // 10 11 1111, -
        {
            this.EnsureWrite(2)
            this._bytes.writeUInt16BE(x | 0x8000, this._writerIndex)
            this._writerIndex += 2
        }
        else if (x < 0x200000) // 110 1 1111, -,-
        {
            // It's not 3 here. It's intentional. 4 bytes are written in big endian mode.
            this.EnsureWrite(4)
            this._bytes.writeInt32BE((x | 0xc00000) << 8, this._writerIndex)
            this._writerIndex += 3
        }
        else if (x < 0x10000000) // 1110 xxxx,-,-,-
        {
            this.EnsureWrite(4)
            this._bytes.writeInt32BE(x | 0xe0000000, this._writerIndex)
            this._writerIndex += 4
        }
        else if (x < 0x800000000) // 1111 0xxx,-,-,-,-
        {
            // For optimization, we use 8 instead of 5 because we will write a long at once
            this.EnsureWrite(8)
            this._bytes.writeUInt8((x / 0x100000000) | 0xf0, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 1)
            this._writerIndex += 5
        }
        else if (x < 0x40000000000) // 1111 10xx, -,-,-,-,-
        {
            this.EnsureWrite(8)
            this._bytes.writeUInt16BE((x / 0x100000000) | 0xf800, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 2)
            this._writerIndex += 6
        }
        else if (x < 0x200000000000) // 1111 110x, -,-,-,-,-,-
        {
            this.EnsureWrite(8)
            this._bytes.writeInt32BE(((x / 0x100000000) | 0xfc0000) << 8, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 3)
            this._writerIndex += 7
        }
        else /*if (x < 0x100000000000000)*/ // 1111 1110, - - - - - - -
        {
            this.EnsureWrite(8)
            this._bytes.writeInt32BE((x / 0x100000000) | 0xfe000000, this._writerIndex)
            this._bytes.writeUInt32BE(x % 0x100000000, this._writerIndex + 4)
            this._writerIndex += 8
        }
    }

    ReadLong () {
        const buf = this._bytes
        ///
        /// warn! If you make any changes, remember to adjust TryDeserializeInplaceOctets
        this.EnsureRead(1)
        const h = buf.readUInt8(this._readerIndex)
        if (h < 0x80) {
            this._readerIndex++
            return BigInt(h)
        }
        else if (h < 0xc0) {
            this.EnsureRead(2)
            const x = buf.readUInt16BE(this._readerIndex) & 0x3fff
            this._readerIndex += 2
            return BigInt(x)
        }
        else if (h < 0xe0) {
            this.EnsureRead(3)
            const x = ((h & 0x1f) << 16) | (buf.readUInt16BE(this._readerIndex + 1))
            this._readerIndex += 3
            return BigInt(x)
        }
        else if (h < 0xf0) {
            this.EnsureRead(4)
            const x = buf.readInt32BE(this._readerIndex) & 0x0fffffff
            this._readerIndex += 4
            return BigInt(x)
        }
        else if (h < 0xf8) {
            this.EnsureRead(5)
            const xl = buf.readUInt32BE(this._readerIndex + 1)
            const xh = h & 0x07
            this._readerIndex += 5
            return BigInt(xh * 0x100000000 + xl)
        }
        else if (h < 0xfc) {  // 1111 10xx  - - - - -
            this.EnsureRead(6)
            const xl = buf.readUInt32BE(this._readerIndex + 2)
            const xh = buf.readUInt16BE(this._readerIndex) & 0x3ff
            this._readerIndex += 6
            return BigInt(xh * 0x100000000 + xl)
        }
        else if (h < 0xfe) {
            this.EnsureRead(7)
            const xl = buf.readUInt32BE(this._readerIndex + 3)
            const xh = (buf.readUInt32BE(this._readerIndex) >> 8) & 0x1ffff
            this._readerIndex += 7
            return BigInt(xh * 0x100000000 + xl)
        }
        else if (h < 0xff) { // 1111 1110, - - - - - - -
            this.EnsureRead(8)
            // warn! If you make any changes, remember to adjust TryDeserializeInplaceOctets
            const xl = buf.readUInt32BE(this._readerIndex + 4)
            const xh = buf.readUInt32BE(this._readerIndex) & 0xffffff
            // console.log(`== read8  ${xl} ${xh}`)
            this._readerIndex += 8
            return (BigInt(xh) << BigInt(32)) | BigInt(xl)
        }
        else {
            this.EnsureRead(9)
            const x = buf.readBigInt64BE(this._readerIndex + 1)
            // const xl = buf.readUInt32BE(this._readerIndex + 5)
            // const xh = buf.readInt32BE(this._readerIndex + 1)
            this._readerIndex += 9
            return x
        }
    }


    WriteFlong (x) {
        this.EnsureWrite(8)
        this._bytes.writeBigInt64LE(x, this._writerIndex)
        this._writerIndex += 8
    }

    ReadFlong () {
        this.EnsureRead(8)
        let x = this._bytes.readBigInt64LE(this._readerIndex)
        this._readerIndex += 8
        return x
    }

    // const bool isLittleEndian = true
    WriteFloat (x) {
        this.EnsureWrite(4)
        this._bytes.writeFloatLE(x, this._writerIndex)
        this._writerIndex += 4
    }

    ReadFloat () {
        this.EnsureRead(4)
        const x = this._bytes.readFloatLE(this._readerIndex)
        this._readerIndex += 4
        return x
    }

    WriteDouble (x) {
        this.EnsureWrite(8)
        this._bytes.writeDoubleLE(x, this._writerIndex)

        this._writerIndex += 8
    }

    ReadDouble () {
        this.EnsureRead(8)
        const x = this._bytes.readDoubleLE(this._readerIndex)
        this._readerIndex += 8
        return x
    }

    WriteSize (n) {
        this.WriteInt(n)
    }

    ReadSize () {
        return this.ReadInt()
    }

    WriteString (x) {
        const n = Buffer.byteLength(x, "utf-8")
        this.WriteSize(n)
        if (n > 0) {
            this.EnsureWrite(n)
            this._bytes.fill(x, this._writerIndex, this._writerIndex + n, 'utf-8')
            this._writerIndex += n
        }
    }

    ReadString () {
        const n = this.ReadSize()
        if (n > 0) {
            this.EnsureRead(n)
            const s = this._bytes.toString("utf-8", this._readerIndex, this._readerIndex + n)
            this._readerIndex += n
            return s
        }
        else {
            return ""
        }
    }

    WriteBytes (x) {
        const n = x != null ? x.length : 0
        this.WriteSize(n)
        if (n > 0) {
            this.EnsureWrite(n)
            this._bytes.fill(x, this._writerIndex)
            this._writerIndex += n
        }
    }

    ReadBytes () {
        const n = this.ReadSize()
        if (n > 0) {
            this.EnsureRead(n)
            const x = Buffer.from(this._bytes.slice(this._readerIndex, this._readerIndex + n))
            this._readerIndex += n
            return x
        }
        else {
            return ByteBuf.emptyBuff
        }
    }

    WriteArrayBuffer (b) {
        this.WriteBytes(new Uint8Array(b))
    }

    ReadArrayBuffer () {
        return this.ReadBytes().buffer
    }


    SkipBytes () {
        const n = this.ReadSize()
        this.EnsureRead(n)
        this._readerIndex += n
    }


    WriteByteBufWithSize (o) {
        const n = o.Size
        if (n > 0) {
            this.WriteSize(n)
            this.WriteBytesWithoutSize2(o._bytes, o._readerIndex, n)
        }
        else {
            this.WriteByte(0)
        }
    }

    WriteByteBufWithoutSize (o) {
        const n = o.Size
        if (n > 0) {
            this.WriteBytesWithoutSize2(o._bytes, o._readerIndex, n)
        }
    }

    WriteRawTag1 (b1) {
        this.EnsureWrite(1)
        this._bytes.writeUInt8(b1, this._writerIndex++)
    }

    WriteRawTag2 (b1, b2) {
        this.EnsureWrite(2)
        this._bytes.writeUInt8(b1, this._writerIndex)
        this._bytes.writeUInt8(b2, this._writerIndex + 1)
        this._writerIndex += 2
    }

    WriteRawTag3 (b1, b2, b3) {
        this.EnsureWrite(3)
        this._bytes.writeUInt8(b1, this._writerIndex)
        this._bytes.writeUInt8(b2, this._writerIndex + 1)
        this._bytes.writeUInt8(b3, this._writerIndex + 2)
        this._writerIndex += 3
    }

}

exports.ByteBuf = ByteBuf
